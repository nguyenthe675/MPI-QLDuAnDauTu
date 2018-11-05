export default [
    {
        id: 1,
        icon: 'icon-speedometer',
        label: 'Tổng quan',
        to: '/',
        permission: ['TS_001']
    },
    {
        id: 2,
        icon: 'icon-briefcase',
        label: 'Quản lý danh mục',
        permission: ['TS_001'],
        content: [
            {
                id: 3,
                icon: 'icon-arrow-right',
                label: 'Danh mục chức danh',
                to: '#chucdanh',
                permission: ['TS_001'],
            },
            {
                id: 4,
                icon: 'icon-arrow-right',
                label: 'Danh mục địa bàn',
                to: '#diaban',
                permission: ['TS_001'],
            },
            {
                id: 5,
                icon: 'icon-arrow-right',
                label: 'Danh mục loại dự án',
                to: '#duan',
                permission: ['ABC'],
            },
            {
                id: 6,
                icon: 'icon-arrow-right',
                label: 'Danh mục loại nguồn vốn',
                to: '#nguonvon',
                permission: ['CDE'],
            },
        ],
    },
    {
        id: 15,
        icon: 'icon-book-open',
        label: 'Nghiệp vụ tài sản',
        permission: ['TS_001'],
        content: [
            {
                id: 16,
                icon: 'icon-arrow-right',
                label: 'Nhóm người dùng',
                to: '#role',
                permission: ['TS_001'],
            },
            {
                id: 17,
                icon: 'icon-arrow-right',
                label: 'Người dùng',
                to: '#user',
                permission: ['TS_001'],
            }
        ],
    },
    {
        id: 7,
        icon: 'icon-list',
        label: 'Quản trị hệ thống',
        permission: ['TS_001'],
        content: [
            {
                id: 8,
                icon: 'icon-arrow-right',
                label: 'Nhóm người dùng',
                to: '#role',
                permission: ['TS_001'],
            },
            {
                id: 9,
                icon: 'icon-arrow-right',
                label: 'Người dùng',
                to: '#users',
                permission: ['TS_001'],
            },
            {
                id: 10,
                icon: 'icon-arrow-right',
                label: 'Tham số hệ thống',
                to: '#syspra',
                permission: ['TS_001'],
            },
            {
                id: 11,
                icon: 'icon-arrow-right',
                label: 'Nhật ký',
                to: '#log',
                permission: ['TS_001'],
            },
            {
                id: 71,
                icon: 'icon-arrow-right',
                label: 'Cấu hình quy trình động',
                to: '#processcfg',
                permission: ['TS_001'],
            },
        ],
    },
    {
        id: 12,
        icon: 'icon-calendar',
        label: 'Tiện ích',
        permission: ['TS_001'],
        content: [
            {
                id: 13,
                icon: 'icon-arrow-right',
                label: 'Nhóm người dùng',
                to: '#role',
                permission: ['TS_001'],
            },
            {
                id: 14,
                icon: 'icon-arrow-right',
                label: 'Người dùng',
                to: '#user',
                permission: ['TS_001'],
            }
        ],
    },
    {
        id: 22,
        icon: 'icon-calendar',
        label: 'Test',
        permission: ['NMMM'],
        content: [
            {
                id: 23,
                icon: 'icon-arrow-right',
                label: 'Nhóm người dùng',
                to: '#role',
                permission: ['NMMM'],
            },

        ],
    },
    {
        id: 18,
        icon: 'icon-chart',
        label: 'Báo cáo',
        permission: ['TS_001'],
        content: [
            {
                id: 19,
                icon: 'icon-arrow-right',
                label: 'Nhóm người dùng',
                to: '#role',
                permission: ['TS_001'],
            },
            {
                id: 20,
                icon: 'icon-arrow-right',
                label: 'Người dùng',
                to: '#user',
                permission: ['TS_001'],
            }
        ],
    },
];