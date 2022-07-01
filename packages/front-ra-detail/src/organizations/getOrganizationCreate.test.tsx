import { Organization } from '@front/model';
import { act, render, screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import {
    AdminContext,
    CoreAdminRoutes,
    CreateParams,
    CreateResult,
    Resource,
    testDataProvider,
} from 'react-admin';
import getOrganizationCreate from './getOrganizationCreate';

describe('<OrganizationCreate />', () => {
    it('新規作成ができる', async () => {
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
                        create={getOrganizationCreate()}
                    />
                </CoreAdminRoutes>
            </AdminContext>
        );

        act(() => {
            history.push('/organizations/create');
        });

        // ユーザー入力
        user.type(
            screen.getByLabelText('resources.organizations.fields.name'),
            '##name##'
        );

        expect(await screen.findByDisplayValue('##name##'));

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
                        name: '##name##',
                    },
                })
            );

        user.click(
            screen.getByRole('button', {
                name: 'ra.action.save',
            })
        );

        await waitFor(() => {
            expect(dataProvider.create).toHaveBeenCalledWith<
                [string, CreateParams<Omit<Organization, 'id'>>]
            >('organizations', { data: { name: '##name##' } });
        });
    });
});
