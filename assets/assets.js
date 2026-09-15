const FONTS = [["Alkhemikal", ["400"]]];

const ASSETS = {
  SPRITE: {
    GOLEM: "assets/img/lem.png",
    ALTAR: "assets/img/altar.png",
    BRAIN: "assets/img/brain.png",
    SIGN: "assets/img/sign.png",
    GIBLETS: {
      0: "assets/img/giblets/skin.png",
      1: "assets/img/giblets/bone.png",
      2: "assets/img/giblets/organ.png",
      3: "assets/img/giblets/blood.png",
    },
  },
  UI: {
    POPUP: "assets/ui/popup.png",
    KEYBOARD: "assets/ui/bind.png",
    ANATOMY: "assets/ui/anatom.png",
  },
  STINK: "assets/img/icon.png",
  // Constants! So we can use shapes as images!
  SHAPE: {
    SQUARE: "-square",
  },
};

const _flatten = (obj) => {
  return Object.values(obj).flatMap((v) =>
    typeof v === "object" ? _flatten(v) : v,
  );
};

const ALL_ASSETS = _flatten(ASSETS).filter((v) => v[0] != "-");
