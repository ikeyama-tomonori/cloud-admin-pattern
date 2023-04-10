import { Organization } from "@web/model";
import { act, render, screen, waitFor } from "@testing-library/react";
import user from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import {
  AdminContext,
  DataProvider,
  GetOneParams,
  GetOneResult,
  Resource,
  testDataProvider,
  UpdateParams,
  UpdateResult,
} from "react-admin";
import { Route, Routes } from "react-router-dom";
import getOrganizationEdit from "./getOrganizationEdit";

test("編集ができる", async () => {
  const dataProvider = testDataProvider();
  const history = createMemoryHistory();

  render(
    <AdminContext dataProvider={dataProvider} history={history}>
      <Routes>
        <Route path="/" element={<div />} />
        <Route
          path="organizations/*"
          element={
            <Resource
              name="organizations"
              edit={getOrganizationEdit({
                mutationMode: "pessimistic",
              })}
            />
          }
        />
      </Routes>
    </AdminContext>,
  );

  // 初期データ表示
  dataProvider.getOne = vi
    .fn<[string, GetOneParams], Promise<GetOneResult<Organization>>>()
    .mockReturnValueOnce(
      Promise.resolve({
        data: {
          id: 1,
          name: "##name##",
        },
      }),
    ) as DataProvider["getOne"];

  act(() => {
    history.push("/organizations/1");
  });

  await waitFor(() => {
    expect(dataProvider.getOne).toHaveBeenCalledWith<[string, GetOneParams]>(
      "organizations",
      { id: "1" },
    );
  });

  expect(await screen.findByDisplayValue("##name##")).toBeInTheDocument();

  // ユーザー入力
  await user.type(
    screen.getByLabelText("resources.organizations.fields.name"),
    " updated",
  );

  await screen.findByDisplayValue("##name## updated");

  // 保存ボタンクリック
  dataProvider.update = vi
    .fn<
      [string, UpdateParams<Organization>],
      Promise<UpdateResult<Organization>>
    >()
    .mockReturnValueOnce(
      Promise.resolve({
        data: {
          id: 1,
          name: "##name## updated",
        },
      }),
    ) as DataProvider["update"];

  await user.click(
    screen.getByRole("button", {
      name: "ra.action.save",
    }),
  );

  await waitFor(() => {
    expect(dataProvider.update).toHaveBeenCalledWith<
      [string, UpdateParams<Organization>]
    >("organizations", {
      id: "1" as unknown as number,
      previousData: { id: 1, name: "##name##" },
      data: { id: 1, name: "##name## updated" },
    });
  });
});
