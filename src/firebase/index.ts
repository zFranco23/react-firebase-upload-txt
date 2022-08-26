import { db } from "./firebase.config";
import { doc, setDoc } from "firebase/firestore";
import { IDocument } from "../interfaces";

const PATH = 'test';

const uploadDocument = (document: IDocument, id: string) => {
    const docRef = doc(db, PATH, id);
    return setDoc(docRef, document);
}

export const multiUpload = async (docs: IDocument[]) => {
    const promises = docs.map((doc: IDocument, idx: number) => uploadDocument(doc, doc.id))
    const resp = await Promise.allSettled(promises);
    let failed: number[] = [];
    resp.forEach((st: PromiseSettledResult<void>, idx) => {
        if (st.status === 'rejected') failed.push(idx);
    })
    failed.forEach((v, i) => {
        console.log('[FAIL] Upload doc failed : ', docs[v]);
    })
}

