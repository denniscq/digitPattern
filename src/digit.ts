import axios from "axios";

// this api is a base one which is used for getting collections.
const collectionApi: string = 'https://api.godid.io/api/collections';
const unavalibleDigit = 'rare4d';

type DigitType = {
    id: string
    name: { en: string }
    slug: string
    subs: Array<DigitType>,
    names: Array<string>
}

interface digitImp {
    detectCollection: (collectionApi: string) => Promise<DigitType[]>,
    detectCaculation: (methodApi: string, name: string) => Promise<string>,
    detectPatterns: (name: string) => Promise<Set<string>>
}

class Digit implements digitImp {
    constructor() { }

    detectCollection = async (collectionApi: string): Promise<DigitType[]> => {
        const collections = (await axios.get(collectionApi)).data as Array<DigitType>;
        const digitObj = collections.find(p => p.slug === 'digits');
        return digitObj.subs;
    }

    detectCaculation = (caculateApi: string, inputName: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            try {
                axios.get(caculateApi).then(res => {
                    const digitObj = res.data as DigitType;
                    if (digitObj.names.findIndex(name => name === inputName) > -1) {
                        resolve(digitObj.slug);
                    } else {
                        resolve('');
                    }
                })
            } catch (error) {
                reject(error)
            }
        })
    }

    detectPatterns = async (inputName: string): Promise<Set<string>> => {
        const result: Set<string> = new Set<string>();
        const runningTasks: Array<Promise<any>> = new Array<Promise<any>>();
        try {
            const collection = await this.detectCollection(collectionApi);
            collection.forEach(p => {
                p.subs.forEach(sub => {
                    if (sub.slug !== unavalibleDigit) {
                        const executing = this.detectCaculation(`${collectionApi}/${sub.id}`, inputName);
                        runningTasks.push(executing);
                    }
                })
            })
            const promiseRes = await Promise.all(runningTasks);
            promiseRes.map(res => {
                if (!!res) {
                    result.add(res.toLocaleUpperCase());
                }
            })

            return result;
        } catch (error) {
            console.error('An error has been occured while getting digit pattern, the detail is %s', error);
        }
    }
}

export default Digit;