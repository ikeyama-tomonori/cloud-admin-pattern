import { getAdmin } from "@web/admin";
import { getDataProvider } from "@web/data-provider";
import {
  getOrganizationCreate,
  getOrganizationEdit,
  getOrganizationList,
  getOrganizationShow,
} from "@web/pages";

const App = getAdmin({
  dataProvider: getDataProvider("/api"),
  resources: {
    organizations: {
      list: getOrganizationList(),
      create: getOrganizationCreate(),
      edit: getOrganizationEdit(),
      show: getOrganizationShow(),
    },
  },
});

export default App;
