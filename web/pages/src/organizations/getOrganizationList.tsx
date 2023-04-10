import { Organization } from "@web/model";
import { Datagrid, List, TextField } from "react-admin";
import { nameof } from "ts-simple-nameof";

export default () => {
  const OrganizationList = () => (
    <List<Organization>>
      <Datagrid rowClick="show">
        <TextField source={nameof<Organization>((o) => o.name)} />
      </Datagrid>
    </List>
  );

  return OrganizationList;
};
