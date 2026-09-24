import { odeServices, USER_PREFS } from '@edifice.io/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { FormEvent, useEffect, useRef, useState } from 'react';
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
  const [cardNumber, setCardNumber] = useState('');
  const autoLoadTriggered = useRef(false);

  const preferenceQuery = useQuery({
    queryKey: ['cursus', 'preference'],
    queryFn: () =>
      odeServices.conf().getPreference<CursusPreference>(USER_PREFS.CURSUS),
  });

  const salesMutation = useMutation({
    mutationFn: async ({
      cardNb,
      persist,
    }: {
      cardNb: string;
      persist: boolean;
    }) => {
      const data = await fetchSales(cardNb);
      if (persist) {
        await odeServices.conf().savePreference(USER_PREFS.CURSUS, { cardNb });
      }
      return data;
    },
  });

  useEffect(() => {
    if (autoLoadTriggered.current || !preferenceQuery.data) return;
    autoLoadTriggered.current = true;

    const storedCardNb = preferenceQuery.data.cardNb;
    if (storedCardNb) {
      setCardNumber(storedCardNb);
      salesMutation.mutate({ cardNb: storedCardNb, persist: false });
    }
  }, [preferenceQuery.data, salesMutation]);

  const status: GenerationHdfStatus = !preferenceQuery.data
    ? 'loading'
    : salesMutation.isPending
      ? 'loading'
      : salesMutation.isError
        ? 'error'
        : salesMutation.isSuccess
          ? 'account'
          : 'idle';

  const wallets = salesMutation.data
    ? mapSalesToWallets(salesMutation.data)
    : [];

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    salesMutation.mutate({ cardNb: cardNumber, persist: true });
  };

  const onClear = () => {
    setCardNumber('');
    salesMutation.reset();
  };

  const onEdit = () => {
    odeServices.conf().savePreference(USER_PREFS.CURSUS, {});
    setCardNumber('');
    salesMutation.reset();
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
