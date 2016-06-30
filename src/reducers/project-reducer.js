import {List, Map, Iterable, fromJS, Seq} from "immutable";

import {LOAD_PROJECT} from '../constants';
import {Scene, Layer, Vertex, Line, Hole, Area} from "../models";

export default function (state, action) {

  switch (action.type) {
    case LOAD_PROJECT:
      return loadProject(state, action.data);

    default:
      return state;

  }
}


function loadProject(state, data) {

  let readVertex = vertex => new Vertex(vertex)
    .set('lines', new List(vertex.lines))
    .set('areas', new List(vertex.areas));

  let readLine = line => new Line(line)
    .set('vertices', new List(line.vertices))
    .set('holes', new List(line.holes));

  let readHole = hole => new Hole(hole);

  let readArea = area => new Area(area)
    .set('vertices', new List(area.vertices));

  let readLayer = layer => new Layer(layer)
    .set('vertices', new Seq(layer.vertices).map(vertex => readVertex(vertex)).toMap())
    .set('lines', new Seq(layer.lines).map(line => readLine(line)).toMap())
    .set('holes', new Seq(layer.holes).map(hole => readHole(hole)).toMap())
    .set('areas', new Seq(layer.areas).map(area => readArea(area)).toMap());

  let readScene = scene => new Scene(scene)
    .set('layers', new Seq(scene.layers).map(layer => readLayer(layer)).toMap());

  let scene = readScene(data);

  return state.set('scene', scene);
}
