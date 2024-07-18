// TODO should be loaded from app in future
import "../resources/services/BlogResourceService";
import "../resources/services/ScrapbookResourceService";

import { IOdeServices, OdeServices } from "./OdeServices";

export const odeServices: IOdeServices = new OdeServices().initialize();

export * from "../directory/interface";
export type { ILinkedResource } from "../resources/behaviours/AbstractBehaviourService"; // FIXME to be removed when dropping behaviours
export * from "../resources/interface";
export * from "../resources/ResourceService";
export * from "../resources/SnipletsService"; // FIXME to be removed when dropping behaviours
export * from "../rights/interface";
export * from "../share/interface";
export * from "../workspace/interface";
