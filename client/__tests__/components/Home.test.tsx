import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomePage from "@/app/(home)/page";
import {getCategories} from "@/api/adminAPI";

// React Query Client 설정
const queryClient = new QueryClient();

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

// API Mocking
jest.mock('../../src/api/adminAPI', () => ({
    getCategories: jest.fn(),
}));

describe('<HomePage />', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        queryClient.clear();
    });

    it('renders loading state initially', () => {
        (getCategories as jest.Mock).mockResolvedValue([]);
        render(<HomePage />, { wrapper });

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders car details successfully', async () => {
        const mockCarDetails = [
            {
                "cno": 57,
                "cname": "ㄴㅇㄹ",
                "cdesc": "ㄴㅇㄹ",
                "delFlag": false,
                "parentCategoryId": null,
                "subCategories": null,
                "file": null,
                "uploadFileName": "https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/category/d64b1523-b625-4622-8c83-8a0dc3471db9_75b617c1cbbd0a0c90724c14b8834352.jpg",
                "uploadFileKey": "category/d64b1523-b625-4622-8c83-8a0dc3471db9_75b617c1cbbd0a0c90724c14b8834352.jpg"
            },
            {
                "cno": 63,
                "cname": "ㅁㄴㅇㄹ",
                "cdesc": "ㅁㄴㅇㄹ",
                "delFlag": false,
                "parentCategoryId": null,
                "subCategories": [
                    {
                        "cno": 65,
                        "cname": "ㅇㅇㅇㅇ",
                        "cdesc": "ㅁㄴㅇㄹㄴㅇ",
                        "delFlag": false,
                        "parentCategoryId": null,
                        "subCategories": null,
                        "file": null,
                        "uploadFileName": "https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/category/c8024893-26dc-42ff-905c-e2bd2276a91e_3ca0b8b0-c89a-4ef9-9225-5224d8b51c87_476b12cf1a3623bc4cd2060495bef990 (1).jpg",
                        "uploadFileKey": "category/c8024893-26dc-42ff-905c-e2bd2276a91e_3ca0b8b0-c89a-4ef9-9225-5224d8b51c87_476b12cf1a3623bc4cd2060495bef990 (1).jpg"
                    }
                ],
                "file": null,
                "uploadFileName": "https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/category/7b3db926-43a1-4ac2-84bf-cd72428f82d2_ë¤í¨2_ë³µì¬ë³¸-001.png",
                "uploadFileKey": "category/7b3db926-43a1-4ac2-84bf-cd72428f82d2_ë¤í¨2_ë³µì¬ë³¸-001.png"
            }
        ];
        (getCategories as jest.Mock).mockResolvedValue(mockCarDetails);

        render(<HomePage />, { wrapper });

        await waitFor(() => {
            expect(screen.getByText('Inspection date updated')).toBeInTheDocument();
            // expect(screen.getByText('Mechanic review completed')).toBeInTheDocument();
        });
    });
    //
    // it('renders error state on fetch failure', async () => {
    //     (fetchCarEventDetails as jest.Mock).mockRejectedValue(new Error('Fetch error'));
    //
    //     render(<HomePage />, { wrapper });
    //
    //     await waitFor(() => {
    //         expect(screen.getByText('Error loading data')).toBeInTheDocument();
    //     });
    // });
    //
    // it('renders empty state if no data is available', async () => {
    //     (fetchCarEventDetails as jest.Mock).mockResolvedValue([]);
    //
    //     render(<CarEventDetails />, { wrapper });
    //
    //     await waitFor(() => {
    //         expect(screen.getByText('No details available')).toBeInTheDocument();
    //     });
    // });
});
