namespace StronglyConnectedComponents {
    export class A<T>{}
    export class Vertex<T>
    {
        Index: number;
        Dependencies: Array<Vertex<T>>;
        Value: T;
        LowLink: number;

        constructor(public value: T, public dependencies: A<Vertex<T>>) {
            this.Value = value;
            this.Index = -1;
            //this.Dependencies = dependencies;
        }
    }

    export class StronglyConnectedComponent<T> extends Array<Vertex<T>>
    {
        private list: Array<Vertex<T>>;

        constructor()
        constructor(collection?: Array<Vertex<T>>) {
            super();

            if (collection == null) {
                this.list = new Array<Vertex<T>>();
            }
            else {
                this.list = collection;
            }
            (<any>Object).setPrototypeOf(this, Object.create(StronglyConnectedComponent.prototype))
        }

        public StronglyConnectedComponent(collection: Array<Vertex<T>>) {
            this.list = collection;
        }

        public Add(vertex: Vertex<T>) {
            this.list.push(vertex);
        }

        public Count(): number {
            return this.list.length;
        }

        public IsCycle() {
            return this.list.length > 1;
        }
    }

    export class StronglyConnectedComponentList<T> extends Array<StronglyConnectedComponent<T>>
    {
        public collection: Array<StronglyConnectedComponent<T>>;
        constructor();
        constructor(Collection?: Array<StronglyConnectedComponent<T>>) {
            super();
            Collection = new Array<StronglyConnectedComponent<T>>();
            this.collection = Collection;
        }

        public Add = (scc: StronglyConnectedComponent<T>) => {
            this.collection.push(scc);
        }

        public Count(): number {
            return this.collection.length;
        }

        public IndependentComponents(): Array<StronglyConnectedComponent<T>> {
            let Result: Array<StronglyConnectedComponent<T>>;
            for (var i = 0; i < this.length; i++) {
                if (this[i].IsCycle() == false) {
                    Result.push(this[i]);
                }
            }
            return Result;
        }

        public Cycles = (): Array<StronglyConnectedComponent<T>> => {
            let Result: Array<StronglyConnectedComponent<T>> = new Array<StronglyConnectedComponent<T>>();

            for (var i = 0; i < this.collection.length; i++) {
                if (this.collection[i].IsCycle() == true) {
                    Result.push(this[i]);
                }
            }
            return Result;
        }
    }

    export class StronglyConnectedComponentFinder<T>
    {
        public stronglyConnectedComponents: StronglyConnectedComponentList<T>;
        stack: Array<Vertex<T>>;
        index: number;

        public DetectCycle(graph: Array<Vertex<T>>): StronglyConnectedComponentList<T> {
            this.stronglyConnectedComponents = new StronglyConnectedComponentList<T>();
            this.index = 0;
            this.stack = new Array<Vertex<T>>();
            for (var i = 0; i < graph.length; i++) {
                if (graph[i].Index < 0) {
                    this.StrongConnect(graph[i]);
                }
            }
            return this.stronglyConnectedComponents;
        }

        private StrongConnect(v: Vertex<T>): void {
            v.Index = this.index;
            v.LowLink = this.index;
            this.index++;
            this.stack.push(v);
            for (var i = 0; i < v.Dependencies.length; i++) {
                if (v.Dependencies[i].Index < 0) {
                    this.StrongConnect(v.Dependencies[i]);
                    v.LowLink = Math.min(v.LowLink, v.Dependencies[i].LowLink);
                }
                else if (this.stack.indexOf(v.Dependencies[i]) > -1) {
                    v.LowLink = Math.min(v.LowLink, v.Dependencies[i].Index);
                }
            }

            if (v.LowLink == v.Index) {
                var scc = new StronglyConnectedComponent<T>();
                let Temp: Vertex<T>;

                do {
                    Temp = this.stack.pop();
                    scc.Add(Temp);
                } while (v != Temp);

                this.stronglyConnectedComponents.Add(scc);
            }
        }
    }


    let Vertexes: StronglyConnectedComponent<number> = new StronglyConnectedComponent<number>();

    let VertexA: Vertex<number> = new Vertex<number>(0, []);
    let VertexB: Vertex<number> = new Vertex<number>(1, []);
    let VertexC: Vertex<number> = new Vertex<number>(2, []);
    let VertexD: Vertex<number> = new Vertex<number>(3, []);


    let VertexE: Vertex<number> = new Vertex<number>(4, []);
    let VertexF: Vertex<number> = new Vertex<number>(5, []);

    VertexA.Dependencies = [VertexB];
    VertexB.Dependencies = [VertexC];
    VertexC.Dependencies = [VertexD];
    VertexD.Dependencies = [VertexA];

    VertexE.Dependencies = [VertexF];
    VertexF.Dependencies = [VertexE];

    Vertexes.push(VertexA);
    Vertexes.push(VertexB);
    Vertexes.push(VertexC);
    Vertexes.push(VertexD);
    Vertexes.push(VertexE);
    Vertexes.push(VertexF);

    let CycleDetector: StronglyConnectedComponentFinder<number> = new StronglyConnectedComponentFinder<number>();
    var Cycles: StronglyConnectedComponentList<number> = CycleDetector.DetectCycle(Vertexes);
    var Detected: Array<StronglyConnectedComponent<number>> = Cycles.Cycles();

    console.log("NumberOf Cycles : " + Cycles.collection.length);
    console.log("NumberOf Detected : " + Detected.length);
}