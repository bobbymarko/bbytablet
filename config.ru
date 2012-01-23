require "rubygems"
require 'rack/contrib'
require 'rack-rewrite'

use Rack::Static, :urls => ['/images'], :root => "public"
use Rack::Static, :urls => ['/css'], :root => "public"
use Rack::Static, :urls => ['/js'], :root => "public"
use Rack::Static, :urls => ['/videos'], :root => "public"
use Rack::ETag
use Rack::Rewrite do
  rewrite '/', '/index.html'
  rewrite %r{/listing(\?.*)?}, '/listing.html$1'
end
run Rack::Directory.new('public')