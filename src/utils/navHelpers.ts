import { omit } from "lodash-es";

import MobActivity from "@/assets/mob-activity.svg";
import MobHome from "@/assets/mob-home.svg";
import MobSettings from "@/assets/mob-settings.svg";

const navList: {
  [key: string]: {
    name: string;
    title: string;
    route: string;
    icon: string;
    mobHidden: boolean;
    navHidden: boolean;
  };
} = {
  home: {
    name: "navBar.home",
    title: "walletHome.walletHome",
    route: "home",
    icon: MobHome,
    mobHidden: false,
    navHidden: false,
  },
  transfer: {
    name: "navBar.transfer",
    title: "walletTransfer.transferDetails",
    route: "transfer",
    icon: MobHome,
    mobHidden: true,
    navHidden: true,
  },
  topup: {
    name: "navBar.topUp",
    title: "walletTopUp.selectProvider",
    route: "topup",
    icon: MobHome,
    mobHidden: true,
    navHidden: true,
  },
  pay: {
    name: "navBar.pay",
    title: "walletPay.pay",
    route: "pay",
    icon: MobActivity,
    mobHidden: true,
    navHidden: true,
  },
  activity: {
    name: "navBar.activity",
    title: "walletActivity.transactionActivities",
    route: "activity",
    icon: MobActivity,
    mobHidden: false,
    navHidden: false,
  },
  settings: {
    name: "navBar.settings",
    title: "walletSettings.settings",
    route: "settings",
    icon: MobSettings,
    mobHidden: false,
    navHidden: false,
  },
};

function getNavList() {
  return omit(navList, "topup");
}

export const NAVIGATION_LIST = getNavList();
