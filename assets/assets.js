const FONTS = [
  ['Alkhemikal', ['400']],
];

const ASSETS = {
  SPRITE: {
    GOLEM: "assets/img/lem.png",
  },
  STINK: "assets/img/icon.png",
};

const _flatten = (obj) => {
  return Object.values(obj).flatMap((v) =>
    typeof v === "object" ? _flatten(v) : v
  );
};

const ALL_ASSETS = _flatten(ASSETS);
