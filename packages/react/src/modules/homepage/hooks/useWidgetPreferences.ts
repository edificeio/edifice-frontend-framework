import { IWidgetFramework, WidgetFrameworkFactory } from '@edifice.io/client';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export default function useWidgetPreferences() {
  const [svc, setSvc] = useState<IWidgetFramework>();

  const saveMutation = useMutation({
    mutationFn: svc?.saveUserPrefs,
  });

  useEffect(() => {
    const widgetService = WidgetFrameworkFactory.instance();
    widgetService.initialize(null, null).then(() => setSvc(widgetService));
  }, []);

  return {
    list: svc?.list,
    lookup: svc?.lookup,
    saveUserPreferences: saveMutation.mutateAsync,
  };
}
