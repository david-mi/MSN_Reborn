import type { DisplayedStatus } from "@/redux/slices/user/types";

export const statusesArray = [
  {
    sentence: "En ligne",
    key: "online",
    icon: "/icons/status/online.png",
  },
  {
    sentence: "Occupé",
    key: "busy",
    icon: "/icons/status/busy.png",
  },
  {
    sentence: "Revient",
    key: "beRightBack",
    icon: "/icons/status/away.png",
  },
  {
    sentence: "Absent",
    key: "away",
    icon: "/icons/status/away.png",
  },
  {
    sentence: "Au téléphone",
    key: "onThePhone",
    icon: "/icons/status/busy.png",
  },
  {
    sentence: "Parti manger",
    key: "outToLunch",
    icon: "/icons/status/away.png",
  },
  {
    sentence: "Hors ligne",
    key: "offline",
    icon: "/icons/status/offline.png",
  },
];

type StatusObject = {
  [key in DisplayedStatus]: {
    sentence: string,
    icon: string
  }
}

export const statusesObject: StatusObject = {
  online: {
    sentence: "En ligne",
    icon: "/icons/status/online.png"
  },
  busy: {
    sentence: "Occupé",
    icon: "/icons/status/busy.png"
  },
  beRightBack: {
    sentence: "Revient",
    icon: "/icons/status/away.png"
  },
  away: {
    sentence: "Absent",
    icon: "/icons/status/away.png"
  },
  onThePhone: {
    sentence: "Au téléphone",
    icon: "/icons/status/busy.png"
  },
  outToLunch: {
    sentence: "Parti manger",
    icon: "/icons/status/away.png"
  },
  offline: {
    sentence: "Hors ligne",
    icon: "/icons/status/offline.png"
  }
}