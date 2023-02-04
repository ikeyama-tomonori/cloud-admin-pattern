import { getAdmin } from "@front/ra-admin";
import { getDataProvider } from "@front/ra-data-provider";
import {
	getOrganizationCreate,
	getOrganizationEdit,
	getOrganizationList,
	getOrganizationShow,
} from "@front/ra-detail";

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
