function AudioEncoder(path) {
    this.worker = new Worker(path);
}
AudioEncoder.prototype.setup = function (cfg) {
    var _this = this;
    return new Promise(function (resolve, reject) {
        _this.worker.onmessage = function (ev) {
            if (ev.data.status != 0) {
                reject(ev.data);
                return;
            }
            resolve(ev.data.packets);
        };
        _this.worker.postMessage(cfg);
    });
};
AudioEncoder.prototype.encode = function (data, callback) {
  this.worker.onmessage = function (ev) {
    if (ev.data.status !== 0) {
      callback(ev.data);
      return;
    }

    callback(false, ev.data.packets);
  };

  this.worker.postMessage(data);
};

module.exports = AudioEncoder;
