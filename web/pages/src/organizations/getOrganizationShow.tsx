import { Organization } from "@web/model";
import { Show, SimpleShowLayout, TextField } from "react-admin";
import { nameof } from "ts-simple-nameof";

export default () => {
  const OrganizationList = () => (
    <Show<Organization>>
      <SimpleShowLayout>
        <TextField source={nameof<Organization>((o) => o.name)} />
      </SimpleShowLayout>
    </Show>
  );

  return OrganizationList;
};
