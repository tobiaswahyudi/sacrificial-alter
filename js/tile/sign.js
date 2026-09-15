const TILE_TYPE_SIGN = 'sign'

const SignTile = (r,c, text = '') => ({
    type: TILE_TYPE_SIGN,
    r,
    c,
    text
})