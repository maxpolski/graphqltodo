import Relay from 'react-relay';

export default class extends Relay.Route {
  static queries = {
    user: () => Relay.QL`query{ user(id: $id) }`,
  };
  static params = {
    id: {
      required: true,
    },
  };
  static routeName = 'AppHomeRoute';
}