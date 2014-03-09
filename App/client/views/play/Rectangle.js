var vertSet = function(){
    return [
        { x: 0, y: 0 },
        { x: this.width || 0, y: 0 },
        { x: this.width || 0, y: this.height || 0 },
        { x: 0, y: this.height || 0 }
    ];
}

Rectangle = function(options){

    var rectangle = $.extend(Physics.body('convex-polygon', $.extend(options, {
        vertices: [
            { x: 0, y: 0 },
            { x: options.width || 0, y: 0 },
            { x: options.width || 0, y: options.height || 0 },
            { x: 0, y: options.height || 0 }
        ]
    })), {
        setWidth : function(width){
            this.width = width;
            this.setVertices(vertSet());
        },
        setHeight : function(height){
            this.height = height;
            this.setVertices(vertSet());
        }
    });

    rectangle.width = options.width;
    rectangle.height = options.height;

    return rectangle;
}