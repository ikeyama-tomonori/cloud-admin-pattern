import { Organization } from '@front/model';
import { act, render, screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import {
    AdminContext,
    CoreAdminRoutes,
    DataProvider,
    GetOneParams,
    GetOneResult,
    Resource,
    testDataProvider,
    UpdateParams,
    UpdateResult,
} from 'react-admin';
import getOrganizationEdit from './getOrganizationEdit';

describe('<OrganizationEdit />', () => {
    it('編集ができる', async () => {
        const dataProvider = testDataProvider();
        const history = createMemoryHistory();

        render(
            <AdminContext dataProvider={dataProvider} history={history}>
                <CoreAdminRoutes
                    layout={({ children }) => <>{children}</>}
                    catchAll={() => <></>}
                    loading={() => <></>}
                >
                    <Resource
                        name="organizations"
                        edit={getOrganizationEdit({
                            mutationMode: 'pessimistic',
                        })}
                    />
                </CoreAdminRoutes>
            </AdminContext>
        );

        // 初期データ表示
        dataProvider.getOne = vi
            .fn<[string, GetOneParams], Promise<GetOneResult<Organization>>>()
            .mockReturnValueOnce(
                Promise.resolve({
                    data: {
                        id: 1,
                        name: '##name##',
                    },
                })
            ) as DataProvider['getOne'];

        act(() => {
            history.push('/organizations/1');
        });

        await waitFor(() => {
            expect(dataProvider.getOne).toHaveBeenCalledWith<
                [string, GetOneParams]
            >('organizations', { id: '1' });
        });

        expect(await screen.findByDisplayValue('##name##')).toBeInTheDocument();

        // ユーザー入力
        user.type(
            screen.getByLabelText('resources.organizations.fields.name'),
            ' updated'
        );

        expect(
            await screen.findByDisplayValue('##name## updated')
        ).toBeInTheDocument();

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
                        name: '##name## updated',
                    },
                })
            ) as DataProvider['update'];

        user.click(
            screen.getByRole('button', {
                name: 'ra.action.save',
            })
        );

        await waitFor(() => {
            expect(dataProvider.update).toHaveBeenCalledWith<
                [string, UpdateParams<Organization>]
            >('organizations', {
                id: '1',
                previousData: { id: 1, name: '##name##' },
                data: { id: 1, name: '##name## updated' },
            });
        });
    });
});
