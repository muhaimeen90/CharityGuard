import {
  createCampaign,
  dashboard,
  logout,
  notifications,
  //payment,
  profile,
  //withdraw,
} from "../assets";

export const navlinks = [
  {
    name: "dashboard",
    imgUrl: dashboard,
    link: "/",
  },
  {
    name: "campaign",
    imgUrl: createCampaign,
    link: "/create-campaign",
  },
  // {
  //   name: "payment",
  //   imgUrl: payment,
  //   link: "/",
  //   disabled: true,
  // },
  {
    name: "notifications",
    imgUrl: notifications,
    link: "/",
    disabled: true,
  },
  {
    name: "profile",
    imgUrl: profile,
    link: "/profile",
  },
  {
    name: "logout",
    imgUrl: logout,
    link: "/",
    disabled: true,
  },
];
