import { ChangeEvent, FC } from 'react'
import { multiUpload } from '../firebase';
import { ICustomDocument } from '../interfaces';
import { batchUpload } from '../firebase/index';


const CustomUpload: FC = () => {

    const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e && e.target) {
            if (e.target.files) {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = function (progressEvent: ProgressEvent) {
                    if (typeof this.result === 'string') {
                        const arrStrings = this.result.split('\n')
                        const cleanLines = arrStrings.filter((s: string) => s.trim().length)

                        //Make your own schema
                        const docsToUpload: ICustomDocument[] = cleanLines.map((line: string) => ({
                            id: line.trim(),
                            createdAt: new Date().getTime(),
                            alreadyUsed: false,
                        }))

                        // multiUpload(docsToUpload);
                        batchUpload(docsToUpload.slice(0,10000));
                    }
                };
                reader.readAsText(file);
            }
        }
    }

    return (
        <div>
            <h1>Custom upload</h1>
            <input type="file" accept="text/plain" onChange={onFileChange} />
        </div>
    )
}

export default CustomUpload