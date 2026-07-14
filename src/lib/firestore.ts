import type {
  DocumentData,
  DocumentSnapshot,
  QueryDocumentSnapshot,
  QuerySnapshot,
} from "firebase/firestore";

export function parseDoc<T extends { id: string }>(
  snapshot: DocumentSnapshot<DocumentData>,
): T | null {
  if (!snapshot.exists()) {
    return null;
  }

  return { id: snapshot.id, ...snapshot.data() } as T;
}

export function parseQuerySnapshot<T extends { id: string }>(
  snapshot: QuerySnapshot<DocumentData>,
): T[] {
  return snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
    id: doc.id,
    ...doc.data(),
  })) as T[];
}

export function parseQuerySnapshotFirst<T extends { id: string }>(
  snapshot: QuerySnapshot<DocumentData>,
): T | null {
  const doc = snapshot.docs[0];
  if (!doc) {
    return null;
  }

  return { id: doc.id, ...doc.data() } as T;
}
