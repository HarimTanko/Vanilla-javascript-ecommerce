const fs = require('fs');
const crypto = require('crypto');

module.exports = class Repository {
  constructor(filename) {
    if (!filename) {
      throw new Error('Creating a new repository requires a filename');
    }

    this.filename = filename;

    try {
      fs.accessSync(this.filename);
    } catch (error) {
      fs.writeFileSync(this.filename, '[]');
    }
  }

  async create(attr) {
    attr.id = this.randomId();

    const records = await this.getAll();

    records.push(attr);

    await this.writeAll(records);

    return attr;
  }

  async getAll() {
    //open  the file called this.filename
    return JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding: 'utf8',
      })
    );
  }

  async writeAll(records) {
    await fs.promises.writeFile(
      this.filename,
      JSON.stringify(records, null, 2)
    );
  }

  randomId() {
    return crypto.randomBytes(4).toString('hex');
  }

  async getOne(id) {
    const records = await this.getAll();

    return records.find((records) => records.id === id);
  }

  async deleteOne(id) {
    const records = await this.getAll();

    const filteredRecords = records.filter((record) => record.id !== id);
    await this.writeAll(filteredRecords);
  }

  async update(id, attr) {
    const records = await this.getAll();

    const record = records.find((record) => record.id === id);

    if (!record) {
      throw new Error(`record with id of ${id} not found`);
    }

    Object.assign(record, attr);

    await this.writeAll(records);
  }

  async findOneBy(filters) {
    const records = await this.getAll();

    for (let record of records) {
      let found = true;

      for (let key in filters) {
        if (record[key] !== filters[key]) found = false;
      }

      if (found) {
        return record;
      }
    }
  }
};
