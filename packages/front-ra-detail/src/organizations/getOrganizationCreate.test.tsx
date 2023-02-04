import { Organization } from "@front/model";
import { act, render, screen, waitFor } from "@testing-library/react";
import user from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import {
	AdminContext,
	CreateParams,
	CreateResult,
	DataProvider,
	Resource,
	testDataProvider,
} from "react-admin";
import { Route, Routes } from "react-router-dom";
import getOrganizationCreate from "./getOrganizationCreate";

test("新規作成ができる", async () => {
	const dataProvider = testDataProvider();
	const history = createMemoryHistory();

	render(
		<AdminContext dataProvider={dataProvider} history={history}>
			<Routes>
				<Route path="/" element={<div />} />
				<Route
					path="organizations/*"
					element={
						<Resource name="organizations" create={getOrganizationCreate()} />
					}
				/>
			</Routes>
		</AdminContext>,
	);

	act(() => {
		history.push("/organizations/create");
	});

	// ユーザー入力
	await user.type(
		screen.getByLabelText("resources.organizations.fields.name"),
		"##name##",
	);

	await screen.findByDisplayValue("##name##");

	// 保存ボタンクリック
	dataProvider.create = vi
		.fn<
			[string, CreateParams<Organization>],
			Promise<CreateResult<Organization>>
		>()
		.mockReturnValueOnce(
			Promise.resolve({
				data: {
					id: 1,
					name: "##name##",
				},
			}),
		) as DataProvider["create"];

	await user.click(
		screen.getByRole("button", {
			name: "ra.action.save",
		}),
	);

	await waitFor(() => {
		expect(dataProvider.create).toHaveBeenCalledWith<
			[string, CreateParams<Omit<Organization, "id">>]
		>("organizations", { data: { name: "##name##" } });
	});
});
