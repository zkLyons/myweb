// 跟品牌管理有关的数据的类型
/**
 * 
 * {code: 200, message: '成功', data: {…}, ok: true}
code: 200
data: {
records: [
    0:{id:1, name: "Apple", logoUrl: "https://example.com/logo1.png", sort: 1, trademarkType: 1, createTime: "2023-10-01T12:00:00Z", updateTime: "2023-10-01T12:00:00Z"}
    1:{id:2, name: "Samsung", logoUrl: "https://example.com/logo2.png", sort: 2, trademarkType: 1, createTime: "2023-10-01T12:00:00Z", updateTime: "2023-10-01T12:00:00Z"}
]
}
message: "成功"
ok: true
 */
// 定义品牌数据的ts类型

export interface ResponseData {
    code: number,
    message: string,
    ok: boolean,
    data: {
        records: Trademark[],
        total: number,
        size: number,
        current: number,
        searchCount:boolean,
        pages: number,
    }
}

export interface Trademark {
    id?: number,
    tmName: string,
    logoUrl: string,
}
