# lg-tools

常用的工具函数

# 安装

```shell
$ npm install lg-tools
# OR
$ yarn add lg-tools
```

# 使用

```typescript
import Tools from 'lg-tools';
```

# API

```tsx
/**
 * 全局声明
 */
declare global {
  interface Window {
    _hmt: any;
    wx: any;
  }
}
interface ITrackPv {
  type: 'pv';
  pageURL?: string /** 指定要统计PV的页面URL。此项必选，必须是以”/”（斜杠）开头的相对路径 */;
}
interface ITrackEs {
  type: 'es';
  category: string /** 要监控的目标的类型名称，通常是同一组目标的名字，比如”视频”、”音乐”、”软件”、”游戏”等等。该项必选 */;
  action?: string /** 用户跟目标交互的行为，如”播放”、”暂停”、”下载”等等。该项必选。 */;
  opt_label?: string /** 事件的一些额外信息，通常可以是歌曲的名称、软件的名称、链接的名称等等。该项可选。 */;
  opt_value?: string /** 事件的一些数值信息，比如权重、时长、价格等等，在报表中可以看到其平均值等数据。该项可选。 */;
}
declare class Tools {
  private static instance;
  private constructor();
  static defaultUtils(): Tools;
  /**
   * 获取queryString参数值
   * @param name
   */
  static query<T>(name?: string): T;
  /**
   * 处理日期格式
   * @param timeStamp  时间错
   * @param format 格式
   */
  static dateFormat(timeStamp: number, format?: string): string;
  /**
   * 删除数组中的指定元素
   * @param arr
   * @param key
   * @param value
   */
  static del<T>(arr: T[], key: keyof T, value: any): T[];
  /**
   * 手机号码格式
   * @param phone
   * @param format space
   */
  static phoneFormatter(phone: string, format?: 'space' | 'encryption'): string;
  /**
   * px转vw
   * @param pixel
   */
  static px2vw(pixel: number): string;
  /**
   * 复制内容至剪贴板
   */
  static clipboard(value: string): Promise<unknown>;
  /**
   * 时间倒计时（返回时分秒）
   * @param timeStamp 时间戳
   * @param format    返回格式 dd hh:mm:ss，不传则返回元组类型[天,时,分,秒]
   * @param type      倒计时格式 default/秒制；ms/毫秒制
   * @param pending   倒计时持续状态
   * @param complete  倒计时结束
   */
  static timeDown(params: {
    timeStamp: number;
    format?: string;
    type?: 'default' | 'ms';
    pending: (time: string | string[]) => void;
    complete: () => void;
  }): number | undefined;
  /**
   * 获取数据类型
   * @param target
   */
  static toRawType(target: any): string;
  /**
   * 百度统计
   * @param options
   */
  static track(options: ITrackPv | ITrackEs): void;
  /**
   * 随机字符
   * @param length
   * @param type
   */
  static randomCharacters(length: number, type?: 'default' | 'uppercase' | 'lowercase' | 'digital'): string;
  /**
   * 获取指定范围内的随机数
   * @param min
   * @param max
   */
  static randomDecimals(min: number, max: number): number;
  /**
   * 获取指定范围内的随机整数
   * @param min
   * @param max
   */
  static randomInteger(min: number, max: number): number;
}
export default Tools;
```
