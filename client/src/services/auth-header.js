// memeriksa Penyimpanan Lokal untuk useritem. Jika ada login userdengan accessToken(JWT),
// kembalikan header HTTP Authorization. Jika tidak, kembalikan objek kosong.
export default function authHeader() {
  const user = JSON.parse(localStorage.getItem('user'))

  if (user && user.accessToken) {
    // for Node.js Express back-end
    return { 'x-access-token': user.accessToken }
  } else {
    return {}
  }
}
