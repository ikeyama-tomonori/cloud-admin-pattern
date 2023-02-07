import { Admin, Resource } from "react-admin";
import type { DataProvider, ResourceProps } from "react-admin";

interface Params {
  dataProvider: DataProvider;
  resources: Record<string, Omit<ResourceProps, "name">>;
}

export default ({ dataProvider, resources }: Params) => {
  const App = () => (
    <Admin dataProvider={dataProvider}>
      {Object.entries(resources).map(([name, props]) => (
        <Resource {...props} key={name} name={name} />
      ))}
    </Admin>
  );

  return App;
};
