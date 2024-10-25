// TODO should be loaded from app in future
import "../resources/services/BlogResourceService";
import "../resources/services/MindmapResourceService";
import "../resources/services/ScrapbookResourceService";
import "../resources/services/CollaborativewallResourceService";
import "../resources/services/WikiResourceService";

import { IOdeServices, OdeServices } from "./OdeServices";

export const odeServices: IOdeServices = new OdeServices().initialize();

export type { ILinkedResource } from "../resources/behaviours/AbstractBehaviourService"; // FIXME to be removed when dropping behaviours
export * from "../resources/SnipletsService"; // FIXME to be removed when dropping behaviours
export * from "../directory/interface";
export * from "../resources/interface";
export * from "../rights/interface";
export * from "../share/interface";
export * from "../workspace/interface";
