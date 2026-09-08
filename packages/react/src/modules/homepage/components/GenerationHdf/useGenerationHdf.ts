import { odeServices, USER_PREFS } from '@edifice.io/client';
import { FormEvent, useEffect, useState } from 'react';
import { formatSolde } from './formatSolde';
import { GenerationHdfStatus, GenerationHdfWallet } from './GenerationHdf';

interface CursusSale {
  numPM: string;
  solde: string;
}

interface CursusWallet {
  code: string;
  libelle: string;
}

interface CursusSalesResponse {
  sales: CursusSale[];
  wallets: CursusWallet[];
}

interface CursusPreference {
  cardNb?: string;
}

function mapSalesToWallets(data: CursusSalesResponse): GenerationHdfWallet[] {
  return (data.sales ?? []).map((sale) => {
    const wallet = data.wallets?.find((w) => w.code === sale.numPM);
    return {
      label: wallet?.libelle ?? '',
      amount: `${formatSolde(sale.solde)} €`,
    };
  });
}

async function fetchSales(cardNb: string): Promise<CursusSalesResponse> {
  const http = odeServices.http();
  const data = await http.get<CursusSalesResponse>('/cursus/sales', {
    queryParams: { cardNb },
  });
  if (http.isResponseError()) {
    throw new Error(http.latestResponse.statusText);
  }
  return data;
}

export function useGenerationHdf() {
  const [status, setStatus] = useState<GenerationHdfStatus>('loading');
  const [cardNumber, setCardNumber] = useState('');
  const [wallets, setWallets] = useState<GenerationHdfWallet[]>([]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const preference = await odeServices
        .conf()
        .getPreference<CursusPreference>(USER_PREFS.CURSUS);

      if (!preference?.cardNb) {
        if (!cancelled) setStatus('idle');
        return;
      }

      if (!cancelled) setCardNumber(preference.cardNb);
      try {
        const data = await fetchSales(preference.cardNb);
        if (cancelled) return;
        setWallets(mapSalesToWallets(data));
        setStatus('account');
      } catch {
        if (!cancelled) setStatus('error');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');

    fetchSales(cardNumber)
      .then((data) => {
        setWallets(mapSalesToWallets(data));
        setStatus('account');
        return odeServices
          .conf()
          .savePreference(USER_PREFS.CURSUS, { cardNb: cardNumber });
      })
      .catch(() => {
        setStatus('error');
      });
  };

  const onClear = () => {
    setCardNumber('');
    setStatus('idle');
  };

  const onEdit = () => {
    odeServices.conf().savePreference(USER_PREFS.CURSUS, {});
    setCardNumber('');
    setWallets([]);
    setStatus('idle');
  };

  return {
    status,
    cardNumber,
    onCardNumberChange: setCardNumber,
    onClear,
    onSubmit,
    onEdit,
    wallets,
  };
}
