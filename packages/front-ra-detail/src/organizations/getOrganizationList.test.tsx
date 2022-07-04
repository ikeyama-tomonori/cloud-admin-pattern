import { Organization } from '@front/model';
import { render, screen, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import {
    AdminContext,
    CoreAdminRoutes,
    DataProvider,
    GetListParams,
    GetListResult,
    Resource,
    testDataProvider,
} from 'react-admin';
import getOrganizationList from './getOrganizationList';

describe('<OrganizationList />', () => {
    it('一覧表示ができる', async () => {
        const dataProvider = testDataProvider();
        const history = createMemoryHistory();

        // 初期表示
        dataProvider.getList = vi
            .fn<[string, GetListParams], Promise<GetListResult<Organization>>>()
            .mockReturnValueOnce(
                Promise.resolve({
                    total: 1,
                    data: [{ id: 1, name: '##name##' }],
                })
            ) as DataProvider['getList'];

        render(
            <AdminContext dataProvider={dataProvider} history={history}>
                <CoreAdminRoutes
                    layout={({ children }) => <>{children}</>}
                    catchAll={() => <></>}
                    loading={() => <></>}
                >
                    <Resource
                        name="organizations"
                        list={getOrganizationList()}
                    />
                </CoreAdminRoutes>
            </AdminContext>
        );

        await waitFor(() => {
            expect(dataProvider.getList).toHaveBeenCalledWith<
                [string, GetListParams]
            >('organizations', {
                filter: {},
                pagination: { page: 1, perPage: 10 },
                sort: { field: 'id', order: 'ASC' },
            });
        });

        expect(await screen.findByText('##name##')).toBeInTheDocument();
    });
});
