Rails.application.routes.draw do
  # The OmniAuth callback routes need to be independent of any dynamic scope
  # (such as the `scope ':locale'` below). See
  # https://github.com/plataformatec/devise/wiki/How-To:-OmniAuth-inside-localized-scope
  # for more. All Other Devise routes work perfectly fine with dynamic scopes.
  devise_for :users,
             skip: [:confirmations, :passwords, :registrations, :sessions,
                    :unlocks],
             controllers: {
                 omniauth_callbacks: 'users/omniauth_callbacks'
             }

  scope '(:locale)', locale: /#{I18nUtils.avail_locales.join('|')}/ do
    # We define a route inside the locale scope that just saves the current
    # locale in the session (for later recall), and continues with OmniAuth as
    # normal.
    devise_scope :user do
      get '/users/auth/:provider' =>
              'users/omniauth_callbacks#passthru_localized',
          as: :user_omniauth_authorize_localized
    end

    devise_for :users,
               skip: [:omniauth_callbacks],
               # Comment the 'omniauth_callbacks: ...' line if you don't want
               # authentication via 3rd party providers.
               controllers: {
                   confirmations: 'users/confirmations',
                   omniauth_callbacks: 'users/omniauth_callbacks',
                   passwords: 'users/passwords',
                   registrations: 'users/registrations',
                   sessions: 'users/sessions',
                   unlocks: 'users/unlocks'
               }

    namespace :api do
      namespace :users do
        # Devise API routes are set up to mirror default Devise routes. Try to
        # always keep the two in sync, for a coherent developer experience.
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
  end

  # We don't anticipate that the FineUploaderController will ever need to be
  # localized, so we keep this outside the `scope ':locale' ...` block above.
  scope 'fine_uploader' do
    post 's3_signature' => 'fine_uploader#s3_signature'
    post 's3_upload_success' => 'fine_uploader#s3_upload_success'
  end

  namespace :admin do
    scope '(:locale)', locale: /#{I18nUtils.admin_avail_locales.join('|')}/ do
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
    end

    get '/(:locale)' => 'home#index', as: :localized_root
    root 'home#index'
  end

  get '/i18n/translations' => 'i18n#translations'
  get '/i18n/switch_locale' => 'i18n#switch_locale', as: :switch_locale

  get '/(:locale)' => 'home#index', as: :localized_root
  root 'home#index'

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
