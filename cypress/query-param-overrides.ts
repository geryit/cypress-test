import {FeatureFlag} from "../src/_services/featureFlagConstants";

export const queryParamOverrides = {
  [FeatureFlag.GROWTH_CACHED_SLOTS_ENABLED]: true,
  [FeatureFlag.GROWTH_HRSA_FAQ_CHANGES_ENABLED]: true,
  [FeatureFlag.CARE_DISCOVERY_TOPICS_SEARCH_ENABLED]: true,
  [FeatureFlag.GROWTH_DISCOVERY_SEARCH_AVAILABILITY_ENABLED]: true,
  [FeatureFlag.GROWTH_DISCOVERY_REMOVING_SPECIALTY_TRIAGE_HOMEPAGE_1]: false,
  [FeatureFlag.GROWTH_DISCOVERY_APPT_REASON_PAGE_AVAILABILITY_ENABLED]: true,
  [FeatureFlag.GROWTH_DISCOVERY_REMOVING_SPECIALTY_TRIAGE_CLINIC_DETAILS_1]: false,
};
