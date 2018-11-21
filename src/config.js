let apiHost = 'http://localhost:3210';
let apiPort = ':3210';
let appHost = '';
// if (process.env.NODE_ENV === 'production') {
//   appHost = process.env.REACT_APP_APPHOST;
//   apiHost = process.env.REACT_APP_APIHOST;
//   apiPort = process.env.REACT_APP_APIPORT;
// }
let apiUrl = `${apiHost}`;
export {
  appHost,
  apiHost,
  apiPort,
  apiUrl
}
