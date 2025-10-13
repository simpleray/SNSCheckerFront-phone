export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  SidePanel: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}