<?php

namespace App\Models;

use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Post extends Model
{
    use HasFactory; 
    protected $fillable = ['title', 'content', 'user_id', 'image'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function likes(){
        return $this->hasMany(Like::class);
    }
    public function unlike(Post $post) {
        return $post->likes()->where('user_id', auth()->user()->id)->delete();
    }
    // In Post model
    public function getLikedAttribute() {
    return $this->likes()->where('user_id', Auth::id())->exists();  
}

}
