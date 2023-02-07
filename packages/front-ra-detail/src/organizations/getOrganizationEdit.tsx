import type { Organization } from "@front/model";
import { Edit, SimpleForm, TextInput, EditProps } from "react-admin";
import { nameof } from "ts-simple-nameof";

export default (param?: {
  mutationMode?: EditProps<Organization>["mutationMode"];
}) => {
  const { mutationMode } = param ?? {};
  const OrganizationCreate = () => (
    <Edit mutationMode={mutationMode}>
      <SimpleForm>
        <TextInput source={nameof<Organization>((o) => o.name)} />
      </SimpleForm>
    </Edit>
  );
  return OrganizationCreate;
};
