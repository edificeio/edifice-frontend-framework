import {
  HooksMessageStart,
  HooksSurveyStart,
  PropertyRecord,
} from '@screeb/sdk-browser';
import { useScreeb as useScreebSDK } from '@screeb/sdk-react';

export type { HooksMessageStart as ScreebMessageHooks };
export type { HooksSurveyStart as ScreebSurveyHooks };
export type ScreebProperties = PropertyRecord;

export function useScreeb() {
  const {
    eventTrack,
    identityProperties,
    messageStart,
    surveyClose,
    surveyStart,
    targetingCheck,
  } = useScreebSDK();

  return {
    closeSurvey: () => surveyClose(),
    forceTargetingCheck: () => targetingCheck(),
    setIdentityProperties: (properties: ScreebProperties) =>
      identityProperties(properties),
    trackEvent: (name: string, properties?: ScreebProperties) =>
      eventTrack(name, properties),
    triggerMessage: (messageId: string, hooks?: HooksMessageStart) =>
      messageStart(messageId, undefined, undefined, hooks),
    triggerSurvey: (
      surveyId: string,
      hooks?: HooksSurveyStart,
      hiddenFields?: ScreebProperties,
    ) => surveyStart(surveyId, undefined, undefined, hiddenFields, hooks),
  };
}
