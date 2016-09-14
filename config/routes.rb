Rails.application.routes.draw do
  # Only allow access to these routes when:
  #  * A subdomain exists, and
  #  * It is NOT 'www'
  # In other words, all routes requiring tenanted access must go here.
  constraints lambda { |r| r.subdomain.present? && r.subdomain != 'www' } do
    devise_for :users,
               controllers: {
                   # Custom controllers needed to support multitenancy
                   sessions: 'sessions',
                   registrations: 'registrations',
                   # Comment this out if you don't want authentication via
                   # 3rd party providers.
                   omniauth_callbacks: 'omniauth_callbacks'
               }

    namespace :api do
      namespace :users do
        # Devise API routes are set up to mirror default Devise routes
        devise_scope :user do
          post 'sign_in' => 'sessions#create'

          post 'sign_up' => 'registrations#create'
          delete '/' => 'registrations#destroy'
        end
      end
    end

    resources :posts

    resources :attachments do
      collection do
        post 'batch_destroy'
      end
    end

    resources :attachment_joins, only: [:create, :destroy]

    scope 'fine_uploader' do
      post 's3_signature' => 'fine_uploader#s3_signature'
      post 's3_upload_success' => 'fine_uploader#s3_upload_success'
    end

    namespace :admin do
      resources :posts, only: [:index, :destroy] do
        collection do
          post 'batch_destroy'
        end
      end

      resources :users, except: [:show] do
        collection do
          post 'batch_destroy'
        end
      end

      resource :app_settings, only: [:show, :update]

      root 'home#index'
    end

    root 'home#index'
  end

  # Only allow access to these routes when:
  # * There is no subdomain, or
  # * The subdomain is 'www'
  # In other words, all routes requiring un-tenanted access must go here.
  constraints subdomain: /\A\z|\Awww\z/ do
    resources :tenants, only: [:create]
    resource :tenant, only: [:destroy]

    get '/' => 'rails/welcome#index'

    # Note that we cannot use 'root' here since we already do so in the block
    # above! So we need to be careful not to use the 'root_path' or 'root_url'
    # helpers.
  end

  # Priority is based on order of creation: first created => highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions
  # automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
