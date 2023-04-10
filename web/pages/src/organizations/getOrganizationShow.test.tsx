import { Organization } from "@web/model";
import { act, render, screen, waitFor } from "@testing-library/react";
import { createMemoryHistory } from "history";
import {
  AdminContext,
  DataProvider,
  GetOneParams,
  GetOneResult,
  Resource,
  testDataProvider,
} from "react-admin";
import { Route, Routes } from "react-router-dom";
import getOrganizationShow from "./getOrganizationShow";

test("単体表示ができる", async () => {
  const dataProvider = testDataProvider();
  const history = createMemoryHistory();

  render(
    <AdminContext dataProvider={dataProvider} history={history}>
      <Routes>
        <Route path="/" element={<div />} />
        <Route
          path="organizations/*"
          element={
            <Resource name="organizations" show={getOrganizationShow()} />
          }
        />
      </Routes>
    </AdminContext>,
  );

  // 初期表示
  dataProvider.getOne = vi
    .fn<[string, GetOneParams], Promise<GetOneResult<Organization>>>()
    .mockReturnValueOnce(
      Promise.resolve({
        data: { id: 1, name: "##name##" },
      }),
    ) as DataProvider["getOne"];

  act(() => {
    history.push("/organizations/1/show");
  });

  await waitFor(() => {
    expect(dataProvider.getOne).toHaveBeenCalledWith<[string, GetOneParams]>(
      "organizations",
      { id: "1" },
    );
  });

  await screen.findByText("##name##");
});
