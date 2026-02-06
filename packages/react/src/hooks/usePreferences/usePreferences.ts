import { odeServices } from '@edifice.io/client';

export default function usePreferences<T = any>(name: string) {
  const getPreference = async (): Promise<T> => {
    const res = await odeServices.conf().getPreference<T>(name);
    return res;
  };

  const savePreference = async (value: T): Promise<void> => {
    const res = await odeServices
      .conf()
      .savePreference(name, JSON.stringify(value));
    return res;
  };

  return { getPreference, savePreference };
}
