import {
  HooksSurveyStart,
  PropertyRecord,
} from '@screeb/sdk-browser';
import { useScreeb as useScreebSDK } from '@screeb/sdk-react';

export type { HooksSurveyStart as ScreebSurveyHooks };
export type ScreebProperties = PropertyRecord;

export function useScreeb() {
  const { eventTrack, surveyStart, identityProperties } = useScreebSDK();

  return {
    trackEvent: (name: string, properties?: ScreebProperties) =>
      eventTrack(name, properties),
    triggerSurvey: (
      surveyId: string,
      hooks?: HooksSurveyStart,
      hiddenFields?: ScreebProperties,
    ) => surveyStart(surveyId, undefined, undefined, hiddenFields, hooks),
    setIdentityProperties: (properties: ScreebProperties) =>
      identityProperties(properties),
  };
}
