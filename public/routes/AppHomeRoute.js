import Relay from 'react-relay';

export default class extends Relay.Route {
  static queries = {
    user: () => Relay.QL`query{ user(login: $login) }`,
  };
  static params = {
    login: {
      required: true,
    },
  };
  static routeName = 'AppHomeRoute';
}