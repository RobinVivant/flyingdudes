var vertSet = function(rect){
    return [
        { x: 0, y: 0 },
        { x: rect.width || 0, y: 0 },
        { x: rect.width || 0, y: rect.height || 0 },
        { x: 0, y: rect.height || 0 }
    ];
}


Rectangle = function(I) {

    var self = {
        body : Physics.body('convex-polygon', {vertices : vertSet(I)})
    };

    $.extend(self, I);

    return {
        addToWorld : function( world ){
            world.add(self.body);
        },
        removeFromWorld : function( world ){
            world.remove(self.body);
        },
        getBody : function(){
            return self.body;
        },
        setWidth : function(width){
            self.width = width;
            self.body.geometry.setVertices(vertSet(self));
        },
        setHeight : function(height){
            self.height = height;
            self.body.geometry.setVertices(vertSet(self));
        }
    };
}
