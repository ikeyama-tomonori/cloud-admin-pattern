import type { Organization } from "@front/model";
import { Create, SimpleForm, TextInput } from "react-admin";
import { nameof } from "ts-simple-nameof";

export default () => {
  const OrganizationCreate = () => (
    <Create>
      <SimpleForm>
        <TextInput source={nameof<Organization>((o) => o.name)} />
      </SimpleForm>
    </Create>
  );
  return OrganizationCreate;
};
