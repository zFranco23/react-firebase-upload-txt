import { db } from "./firebase.config";
import { doc, writeBatch, setDoc } from "firebase/firestore";
import { IDocument } from "../interfaces";

const PATH = 'test';
const MAX_FIREBASE_DOCS_PER_BATCH = 500;

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

//MAXIMUM 500 OPERATIONS PER BATCH
const batchPartitionUpload = async (partialDocs: IDocument[]) => {
    const batchHandler = writeBatch(db);
    partialDocs.forEach((d: IDocument, idx: number) => {
        const docRef = doc(db, PATH, d.id);
        batchHandler.set(docRef, d);
    })
    await batchHandler.commit();
}

export const batchUpload = async (docs: IDocument[]) => {
    const chunkSize = docs.length > MAX_FIREBASE_DOCS_PER_BATCH
        ? Math.ceil(docs.length / MAX_FIREBASE_DOCS_PER_BATCH)
        : 1;
    for (let i = 0; i < chunkSize; i++) {
        const init = i * MAX_FIREBASE_DOCS_PER_BATCH;
        const end = (i + 1) * MAX_FIREBASE_DOCS_PER_BATCH - 1;
        batchPartitionUpload(docs.slice(init, end + 1));
        console.log('PARTITION : ',docs.slice(init, end + 1))
    }

}


