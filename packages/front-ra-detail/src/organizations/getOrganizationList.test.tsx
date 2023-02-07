import { Organization } from "@front/model";
import { act, render, screen, waitFor } from "@testing-library/react";
import { createMemoryHistory } from "history";
import {
  AdminContext,
  DataProvider,
  GetListParams,
  GetListResult,
  Resource,
  testDataProvider,
} from "react-admin";
import { Route, Routes } from "react-router-dom";
import getOrganizationList from "./getOrganizationList";

test("一覧表示ができる", async () => {
  const dataProvider = testDataProvider();
  const history = createMemoryHistory();

  render(
    <AdminContext dataProvider={dataProvider} history={history}>
      <Routes>
        <Route path="/" element={<div />} />
        <Route
          path="organizations/*"
          element={
            <Resource name="organizations" list={getOrganizationList()} />
          }
        />
      </Routes>
    </AdminContext>,
  );

  // 初期表示
  dataProvider.getList = vi
    .fn<[string, GetListParams], Promise<GetListResult<Organization>>>()
    .mockReturnValueOnce(
      Promise.resolve({
        total: 1,
        data: [{ id: 1, name: "##name##" }],
      }),
    ) as DataProvider["getList"];

  act(() => {
    history.push("/organizations/");
  });

  await waitFor(() => {
    expect(dataProvider.getList).toHaveBeenCalledWith<[string, GetListParams]>(
      "organizations",
      {
        filter: {},
        pagination: { page: 1, perPage: 10 },
        sort: { field: "id", order: "ASC" },
      },
    );
  });

  await screen.findByText("##name##");
});
