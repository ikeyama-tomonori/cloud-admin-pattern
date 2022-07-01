import { Organization } from '@front/model';
import { act, render, screen, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import {
    AdminContext,
    CoreAdminRoutes,
    GetOneParams,
    GetOneResult,
    Resource,
    testDataProvider,
} from 'react-admin';
import getOrganizationShow from './getOrganizationShow';

describe('<OrganizationShow />', () => {
    it('単体表示ができる', async () => {
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
                        show={getOrganizationShow()}
                    />
                </CoreAdminRoutes>
            </AdminContext>
        );

        // 初期表示
        dataProvider.getOne = vi
            .fn<[string, GetOneParams], Promise<GetOneResult<Organization>>>()
            .mockReturnValueOnce(
                Promise.resolve({
                    data: { id: 1, name: '##name##' },
                })
            );
        act(() => {
            history.push('/organizations/1/show');
        });

        await waitFor(() => {
            expect(dataProvider.getOne).toHaveBeenCalledWith<
                [string, GetOneParams]
            >('organizations', { id: '1' });
        });

        expect(await screen.findByText('##name##')).toBeInTheDocument();
    });
});
