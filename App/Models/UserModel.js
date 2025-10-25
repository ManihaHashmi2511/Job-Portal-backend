const supabase = require('../supabase');

class UserModel {
  static async create(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select();

    if (error) throw error;
    return data[0];
  }

  static async findOne(query) {
    let queryBuilder = supabase.from('users').select('*');

    if (query.email) {
      queryBuilder = queryBuilder.eq('email', query.email);
    }

    const { data, error } = await queryBuilder.single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async findByIdAndUpdate(id, updateData) {
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

module.exports = UserModel;
